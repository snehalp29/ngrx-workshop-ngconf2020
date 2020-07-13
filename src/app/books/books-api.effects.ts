import {
    Injectable
} from "@angular/core";
import {
    createEffect,
    Actions,
    ofType
} from "@ngrx/effects";
import {
    mergeMap,
    map,
    exhaustMap,
    concatMap
} from "rxjs/operators";
import {
    BooksService
} from "../shared/services";
import {
    BooksPageActions,
    BooksApiActions
} from "./actions";

@Injectable()
export class BooksApiEffects {
    constructor(private booksService: BooksService, private actions$: Actions) { }

    loadBooks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(BooksPageActions.enter),
            exhaustMap(() =>
                this.booksService
                    .all()
                    .pipe(map(books => BooksApiActions.booksLoaded({
                        books
                    })))
            )
        )
    })


    createBooks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(BooksPageActions.createBook),
            concatMap((action) => {
                return this.booksService.create(action.bookRequiredProps).pipe(
                    map(book => BooksApiActions.booksCreated({ book }))
                )
            }
            )
        );
    });


    updateBook$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(BooksPageActions.updateBook),
            concatMap((action) => {
                return this.booksService.update(action.bookId, action.changes).pipe(
                    map(book => BooksApiActions.bookUpdated({ book }))
                )
            }));
    });

    deleteBook$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(BooksPageActions.deleteBook),
            mergeMap((action) => {
                return this.booksService.delete(action.bookId).pipe(
                    map(() => BooksApiActions.bookDeleted({ bookId: action.bookId }))
                )
            }));
    });
}